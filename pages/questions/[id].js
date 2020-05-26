import Router, { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import { withApollo } from '../../lib/withApollo'
import {
  getQuestionById,
  getNextQuestion,
  YES,
  NO,
  MAYBE,
} from '../../lib/questions'

const QuestionsPage = ({ auth }) => {
  const router = useRouter()
  const { id } = router.query
  const question = getQuestionById(id)
  console.log('question:', question)

  function submit(response) {
    question.save(response)
    const nextQuestion = getNextQuestion(id)
    if (nextQuestion) {
      Router.push(`/questions/${nextQuestion.id}`)
    } else {
      Router.push(`/done-answering`)
    }
  }

  return (
    <>
      <h2>Yes / No / Maybe</h2>
      <p>Create and share your yes/no/maybe list</p>
      <p>{question.text}</p>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        <Button onClick={() => submit(MAYBE)}>Maybe</Button>
        <Button onClick={() => submit(NO)}>No</Button>
        <Button onClick={() => submit(YES)}>Yes</Button>
      </ButtonGroup>
    </>
  )
}

export default withApollo({ ssr: true })(QuestionsPage)
