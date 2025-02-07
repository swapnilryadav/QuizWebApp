import { useState, useEffect } from "react"
import axios from "axios"
const Quiz = () => {
  const [quizData, setQuizData] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timeTaken, setTimeTaken] = useState(0)
  const [validationError, setValidationError] = useState(false)

  // Timer effect
  useEffect(() => {
    let intervalId
    if (quizStarted && !quizCompleted) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [quizStarted, quizCompleted, startTime])

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get("https://quiz-web-application-1-pzpb.onrender.com/api/quiz")
        setQuizData(response.data)
      } catch (err) {
        console.error("Error fetching quiz data:", err)
      }
    }

    fetchQuizData()
  }, [])

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
  }

  const handleSelectOption = (questionId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
    setValidationError(false)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (!selectedOptions[quizData.questions[currentQuestionIndex].id]) {
      setValidationError(true)
      return
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleFinalSubmit = () => {
    const unansweredQuestions = quizData.questions.filter((question) => !selectedOptions[question.id])

    if (unansweredQuestions.length > 0) {
      setValidationError(true)
      return
    }

    const message = `Are you sure you want to submit? Make sure you have answered all ${quizData.questions.length} quizzes.`
    if (window.confirm(message)) {
      handleSubmitAnswer()
    }
  }

  const handleSubmitAnswer = () => {
    let scoreTemp = 0

    quizData.questions.forEach((question) => {
      const selected = selectedOptions[question.id]
      question.options.forEach((option) => {
        if (selected === option.id && option.is_correct) {
          scoreTemp += 1
        }
      })
    })

    setScore(scoreTemp)
    setQuizCompleted(true)
    setTimeTaken((elapsedTime / 60).toFixed(2))
  }

  const handleRestartQuiz = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedOptions({})
    setElapsedTime(0)
    setTimeTaken(0)
    setValidationError(false)
  }

  if (!quizData) return <p>Loading quiz...</p>

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <div className="start-screen">
          <h1>{quizData.title}</h1>
          <button className="start-btn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      ) : quizCompleted ? (
        <div className="quiz-results">
          <div className="result-container">
            <h2>Quiz Completed!</h2>
            <p>
              Your Score: {score} / {quizData.questions.length}
            </p>
            <p>Total Time Taken: {timeTaken} minutes</p>
            <div className="question-results">
              {quizData.questions.map((question, index) => (
                <div key={index} className="question-result">
                  <h3>
                    Quiz {index + 1}: {question.description}
                  </h3>
                  <ul>
                    {question.options.map((option) => {
                      const isSelected = selectedOptions[question.id] === option.id
                      const isCorrect = option.is_correct
                      return (
                        <li key={option.id} className={`${isSelected ? (isCorrect ? "correct" : "wrong") : ""}`}>
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            id={`option-${option.id}`}
                            checked={isSelected}
                            disabled
                          />
                          <label htmlFor={`option-${option.id}`}>
                            {option.description}
                            {isSelected && !isCorrect && <span className="selected-answer">(Your Answer)</span>}
                            {isCorrect && !isSelected && <span className="correct-answer">(Correct Answer)</span>}
                            {isSelected && isCorrect && <span className="correct-answer">(Correct Answer)</span>}
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              <button className="restart-btn" onClick={handleRestartQuiz}>
                Start Next Quiz
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="question-screen">
          <div className="question-header">
            <span className="question-number">Quiz {currentQuestionIndex + 1}</span>
            <div className={`timer ${elapsedTime > 300 ? "warning" : ""}`}>{formatTime(elapsedTime)}</div>
          </div>
          <h2 className="question-text">{quizData.questions[currentQuestionIndex].description}</h2>

          {validationError && (
            <p style={{ color: "red", marginBottom: "1rem" }}>Please answer all quizzes before submitting.</p>
          )}

          <ul className="options-list">
            {quizData.questions[currentQuestionIndex].options.map((option) => (
              <li key={option.id} className="option-item">
                <input
                  type="radio"
                  name={`question-${quizData.questions[currentQuestionIndex].id}`}
                  id={`option-${option.id}`}
                  checked={selectedOptions[quizData.questions[currentQuestionIndex].id] === option.id}
                  onChange={() => handleSelectOption(quizData.questions[currentQuestionIndex].id, option.id)}
                />
                <label htmlFor={`option-${option.id}`}>{option.description}</label>
              </li>
            ))}
          </ul>

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && <button onClick={handlePreviousQuestion}>Previous Quiz</button>}

            {currentQuestionIndex === quizData.questions.length - 1 ? (
              <button className="submit-btn" onClick={handleFinalSubmit}>
                Submit Quiz
              </button>
            ) : (
              <button onClick={handleNextQuestion}>Next Quiz</button>
            )}
          </div>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: "#7f8c8d",
            }}
          >
            Attempted Quizzes: {Object.keys(selectedOptions).length} / {quizData.questions.length}
          </div>
        </div>
      )}
    </div>
  )
}
export default Quiz;

