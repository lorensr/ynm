class Question {
  constructor(data) {
    Object.assign(this, data)
  }

  save(response) {
    localStorage.setItem(`q-${this.id}`, response)
  }
}

const questionData = [
  {
    id: 1,
    text: 'Do you like A?',
  },
  {
    id: 2,
    text: 'Do you like B?',
  },
  {
    id: 3,
    text: 'Do you like C?',
  },
  {
    id: 4,
    text: 'Do you like D?',
  },
]

const questions = questionData.map((data) => new Question(data))

export default questions

const normalizeId = (id) => (typeof id === 'string' ? parseInt(id) : id)

export const getQuestionById = (id) =>
  questions.find((q) => q.id === normalizeId(id))

export const getNextQuestion = (afterId) =>
  questions.find((q) => q.id > normalizeId(afterId))

export const YES = 'YES'
export const NO = 'NO'
export const MAYBE = 'MAYBE'
