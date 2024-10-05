import React, {useState, useEffect , useRef} from "react";

import hints from "../../data/hints.json";
import styles from "./Game.module.css";
import db from "../../firebase/firebase";
import { serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { fillHintArrayHelper } from "../../HintHelpers";
import players from "../../data/players.json";

export const Game = () => {
  const [revealedHints, setRevealedHints] = useState([0]); 
  const [userInputs, setUserInputs] = useState([]); 
  const [hintArray, setHintArray] = useState(Array(20).fill(''));
  const [playerId, setPlayerId] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [visibleHints, setVisibleHints] = useState([0]);
  const [inputValue, setInputValue] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [playerImageURL, setPlayerImageURL] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [todayString, setTodayString] = useState('');
  const [buttonText, setButtonText] = useState('Copy Results');
  const [inputRefs, setInputRefs] = useState([]);

  const lastRevealedCardRef = useRef(null);

  useEffect(()=> {

    // Create an array of refs for the input fields (based on the number of hints)
    setInputRefs((elRefs) =>
      Array(20)
        .fill()
        .map((_, i) => elRefs[i] || React.createRef())
    );


    //Get Timestamp
    const fetchPlayerId = async () => {
      
      var docRef = doc(db, 'dates', 'dates');
      const timeStamp = await updateDoc(docRef, {
        timeStamp: serverTimestamp() 
      });

      //Get today's player ID 
      await getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          var data = docSnap.data();
          var time = data.timeStamp;
          const today = time.toDate().toDateString();
          setTodayString(today);
          var playerDocRef = doc(db, 'dates', today);
          getDoc(playerDocRef).then(playerDocSnap => {
            if (playerDocSnap.exists) {
              var playerData = playerDocSnap.data();
              var playerIdData = playerData.id;
              setPlayerId(playerIdData);

              //Fetch player Data
              fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://api-web.nhle.com/v1/player/" + playerIdData + "/landing"), {
                method: 'GET',
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
              })
              .then(data => {
                const myData = JSON.parse(data.contents);
                setHintArray(fillHintArray(myData));
              })
              .catch(err => alert("Error Loading: " + err + ". Please try reloading the page."));
            }
          })
        }
      })
    }
    
    fetchPlayerId();
      
  }, []); 

  
  const fillHintArray = (data) => {
    setPlayerName(data.firstName.default + " " +  data.lastName.default);
    setPlayerImageURL(data.headshot);
    return fillHintArrayHelper(data);
  }
  
  const handleGuess = (selectedName) => {
    if (gameOver) return;

    const guess = selectedName || inputValue;
    const nextIndex = revealedHints.length; 

    //Update the user's guess (whether correct or incorrect)
    const updatedInputs = [...userInputs, guess];
    setUserInputs(updatedInputs);
    
    // Check if guess is correct
    if (isCorrectGuess(guess)) {
      const hintSingOrPlural = (nextIndex == 1) ? "hint" : "hints";
      setModalMessage(`You got it! You were able to guess the correct player with ${nextIndex} ${hintSingOrPlural}!`);
      setModalVisible(true);
      setInputValue(''); // Clear input
      setGameOver(true);
      return;
    }

    // Check if the user has reached 20 guesses
    if (nextIndex === 20) {
      setRevealedHints([...revealedHints, nextIndex]);
      setTimeout(() => {
        setModalMessage("Sorry, you were not able to correctly guess today's player.");
        setModalVisible(true);
        setGameOver(true);
      }, 100);
      return;
    }

    // Check if the next hint can be revealed
    if (nextIndex < hints.length) {
      setRevealedHints([...revealedHints, nextIndex]); // Reveal the next hint

      // Delay applying visible class for a smooth transition
      setTimeout(() => {
        setVisibleHints(prev => [...prev, nextIndex]);

        // Automatically focus the input for the next hint
        if (inputRefs[nextIndex] && inputRefs[nextIndex].current) {
          inputRefs[nextIndex].current.focus();
        }

         // Scroll into view only if on mobile
        if (lastRevealedCardRef.current && window.innerWidth < 830) {
          // Define a constant for keyboard height (adjust if necessary)
          const keyboardHeight = 200; // or a more accurate value based on device
          const scrollPosition = lastRevealedCardRef.current.getBoundingClientRect().top + window.scrollY - keyboardHeight;

          // Scroll to position, adjusting for the keyboard
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          });
        }

      }, 50); // Small delay to allow transition
    }

    setInputValue('');
  };

  const isCorrectGuess = (input) => {
    const inputToLower = input.toLowerCase();
    const playerNameToLower = playerName.toLowerCase();
    return inputToLower === playerNameToLower;
  }

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);

    //Filter Players based on input
    if (value) {
      const filtered = players.filter(player => {
        const fullName = player.name.toLowerCase();
        const [firstName, lastName] = player.name.toLowerCase().split(' ');
        return fullName.startsWith(value) || 
               (firstName.startsWith(value) || lastName.startsWith(value)) ||
               `${firstName} ${lastName}`.startsWith(value);
    });
      setFilteredPlayers(filtered);

       // Scroll to suggestions
       if (filtered.length > 0) {
        setTimeout(() => {
            const suggestionsElement = document.querySelector(`.${styles.suggestions}`);
            if (suggestionsElement) {
                suggestionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
       }
    }
    else {
      setFilteredPlayers([]);
    }
  };

  const handleSuggestionClick = (playerName) => {
    setInputValue(playerName);
    setFilteredPlayers([]);

    // Call handleGuess after updating inputValue
    handleGuess(playerName);

  };

  const Modal = ({ message, playerName, playerImage, onClose, hintsUsed }) => {
    const handleShare = () => {
      const hintSingOrPlural = (hintsUsed == 1) ? "hint" : "hints";
      const resultText = `Chel Guesser - ${todayString}\n\n` +
      `${message.includes("Sorry") ? "I was unable to correctly guess the player." : `I guessed the player with ${hintsUsed} ${hintSingOrPlural}!`}\n` +
      "Can you beat my score? Give it a try at https://www.chelguesser.netlify.app";
  
      // Copy the result text to clipboard
      navigator.clipboard.writeText(resultText)
        .then(() => {
          setButtonText('Copied!');
          setTimeout(() => {
            setButtonText('Copy Results');
          }, 1500);
        });
    };

    return (
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div 
          className={styles.modal} 
          onClick={(e) => e.stopPropagation()} 
        >
          <p className={styles.modalMessage}>{message}</p>
  
          {/* Player Image */}
          <img src={playerImage} alt={playerName} className={styles.playerImage} />
  
          {/* Player Name */}
          <p className={styles.playerName}>{playerName}</p>
  
          {/* Share and Close Buttons */}
          <button className={styles.modalButton} onClick={handleShare}>
            {buttonText}
          </button>
          <button className={styles.modalButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };
  
  const reopenModal = () => {
    setModalMessage(`You guessed the correct player!`);
    setModalVisible(true);
  };

  return (
    <div className={styles.container}>
      {hintArray.map((hint, index) => {
        const isLastRevealed = revealedHints.length - 1 === index;
        return revealedHints.includes(index) && (
          <div 
            key={index} 
            className={`${styles.card} ${visibleHints.includes(index) ? styles.visible : ''}`}
            ref={isLastRevealed ? lastRevealedCardRef : null}
          >
            <h2 className={styles.title}>Hint #{index + 1}</h2>

            {index === 19 ? (
            // If it's the 20th hint, show the player's image instead of text
            <>
              <p className={styles.hint}>This is what the player looks like:</p>
              <img
                src={playerImageURL}
                alt={playerName}
                className={styles.playerImageHint} // Add a class for styling the image
              />
            </>
            ) : (
            // Otherwise, show the text hint
            <p className={styles.hint}>{hint}</p>
            )}

            {index === revealedHints[revealedHints.length - 1] && !gameOver ? (
              //Show input and button for the most recently revealed hint
              <>
                <input
                  className={styles.input}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  ref={inputRefs[index]}
                  placeholder="Type player name"  
                />

                {/*autocomplete suggestions */}
                {filteredPlayers.length > 0 && (
                  <ul className={styles.suggestions}>
                    {filteredPlayers.map((player, i) => (
                      <li key={i} onClick={() => {
                        handleSuggestionClick(player.name);
                    }}>
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
                
              </>
            ): (
              // Show the user's input with dynamic class for correct or incorrect guess
              <p 
                className={isCorrectGuess(userInputs[index]) ? styles.correctGuess : styles.wrongGuess}
                onClick={isCorrectGuess(userInputs[index]) ? reopenModal : null}>
                {userInputs[index]}
              </p>
            )}
          </div>
        )
      })}
      {/* Show the View Results button once the game is over */}
      {gameOver && (
        <button 
          className={styles.viewResultsButton} 
          onClick={() => setModalVisible(true)}
         >
          View Results
        </button>
    )}

    {/* Show the modal if visible */}
    {modalVisible && (
      <Modal 
        message={modalMessage} 
        playerName={playerName} 
        playerImage={playerImageURL} 
        onClose={() => setModalVisible(false)}
        hintsUsed={revealedHints.length}
        gameOver={gameOver}
      />
    )}  
    </div>
  )
}