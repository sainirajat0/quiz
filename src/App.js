import { useEffect, useState } from 'react';
import {sha1} from 'crypto-hash';
import {Instructions} from './utils/data';
import DarkModeToggle from "react-dark-mode-toggle";
import "./App.css"
function App() {
  const [usedQue, setUsedOue] = useState([])
  const [newQue, setNewQue] = useState({})
  const [score, setScore] = useState(0)
  const [chancesLeft, setChancesLeft] = useState(3)
  const [answer, setAnswer] = useState("")
  const [finish, setFinish] = useState(false)
  const [error, setError] = useState(false)
  const [textError, setTextError] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => false);

    useEffect(() => { 
      generateQuestion()
      }, [])

      const generateQuestion = () => {
        fetch("https://eok9ha49itquif.m.pipedream.net", {
        method: "GET",
        mode: 'cors',
        // headers: {"Authorization": `Bearer f94b01164ea17050a61e859b`}
      })
          .then(res => res.json())
          .then(
            (result) => {
            const used = [...usedQue]
            const newQuestion = []
            result.questions.map(data => {
              if(used.length){
                used.map(que => {
                  if(que.answerSha1 !== data.answerSha1){
                    newQuestion.push(data)
                    return setNewQue(newQuestion[0])
                  }
                }) 
              }
              else{
                newQuestion.push(data)
                used.push(data)
                return setNewQue(newQuestion[0])
              }
            })
            
            // console.log(newQuestion[0])
            // console.log(used)
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
            //   setIsLoaded(true);
            //   setError(error);
              setError(true)
            }
          )
      }
    const validate = async () => {
      if(answer === ""){
        return setTextError(true)
      }
      const finalAnswer = answer.toLowerCase()
      const hashAnswer = await sha1(finalAnswer);
      console.log(chancesLeft)
      if(chancesLeft > 1){
        if(`${hashAnswer}` === newQue.answerSha1){
          setScore(score + 1)
        }
        else{
          setChancesLeft(chancesLeft - 1)
        }
        setAnswer("")
        generateNew()
      }
      else{
        setFinish(true)
      }
    }
    const generateNew = () => {
      const used = [...usedQue]
      used.push(newQue)
      setUsedOue(used)
      generateQuestion()
    }
    const restart = () => {
      setFinish(false)
      setUsedOue([])
      setScore(0)
      setChancesLeft(3)
      generateQuestion()
    }
  return (
    <div className={!isDarkMode ? "header-container" : "header-container-dark"}>
      <header className={!isDarkMode ? "header" : "header-dark"}>
        <div className={!isDarkMode ? "logo" : "logo-dark"}>
          Quiz
        </div>
        <DarkModeToggle
          onChange={setIsDarkMode}
          checked={isDarkMode}
          size={60}
        />
      </header>
      {
        !finish ? 
        <div className='main-container'>
          <section className={!isDarkMode ? "section" : "section-dark"}>
            <h1 className={!isDarkMode ? "ins" : "ins-dark"}>
              Instructions
            </h1>
            <ul className={!isDarkMode ? "ins-list" : "ins-list-dark"}>
              {Instructions.map((ins, i) => {
                return(
                  <li key={i}>
                    {ins}
                  </li>
                )
              })}
            </ul>
          </section>
          <div className='question-container'>
            <div className={!isDarkMode ? "question-board" : "question-board-dark"}>
              <div>
                <h1 className={!isDarkMode ? "question" : "question-dark"}>
                  Q. {newQue.question ? newQue.question : ""}
                </h1>
                <input type={"text"} className="question-input" onChange={(e) => setAnswer(e.target.value)}/>
                {
                  textError ? 
                  <p className="error" >Please enter an answer</p>:
                  null
                }
              </div>
              <button className="submit-button py-1 px-2" onClick={() => validate()}>Submit</button>
            </div>
            <div className={!isDarkMode ? "score-board" : "score-board-dark"}>
              <hgroup className={!isDarkMode ? "score" : "score-dark"}>
                <h1>Total Score : {score}</h1>
                <h1>Chances Left : {chancesLeft}</h1>
              </hgroup>
            </div>
          </div>
        </div>
      :
        <div className='question-container main-container'>
          <div className={!isDarkMode ? "finish-card" : "finish-card-dark"}>
            <hgroup className={!isDarkMode ? "finish-card-text" : "finish-card-text-dark"}>
              <h1>Thanks for taking the quiz</h1>
              <h1>Your final score is {score}</h1>
            </hgroup>
            <button className="retake-button py-1 px-2" onClick={() => restart()}>Retake Quiz</button>
          </div>
        </div>
      }
      <div>     
                {error ? (
                    <>
                        <div
                        className="errorCard" 
                        >
                            <div className="error-container">
                                <div className="error-container-child grid">
                                    <div className="error-container-card">
                                        <h1 className="error-head">Network Error</h1>
                                        <div className="mb-2">
                                            <p className="error-p" >Please check your network.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={!isDarkMode ? "opacity-container" : "opacity-container-dark"}></div>
                    </>
                ) : null}
            </div>
    </div>
  );
}

export default App;
