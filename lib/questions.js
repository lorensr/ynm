class Question {
  constructor(id, text) {
    this.id = id
    this.text = text
  }

  save(response) {
    localStorage.setItem(`q-${this.id}`, response)
  }
}

const basicQuestions = [1, 3]
const impactQuestions = [2, 1, 4]

const questionMap = {
  1: 'Do you like A?',
  2: 'Do you like B?',
  3: 'Do you like C?',
  4: 'Do you like D?',
}

const questions = Object.entries(questionMap).map(
  ([id, text]) => new Question(id, text)
)

export default questions

const normalizeId = (id) => (typeof id === 'string' ? parseInt(id) : id)

export const getQuestionById = (id) => questionData[id]

export const getNextQuestion = (afterId) =>
  questions.find((q) => q.id > normalizeId(afterId))

export const YES = 'YES'
export const NO = 'NO'
export const MAYBE = 'MAYBE'
