/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, Card, Divider } from '@mui/joy'
import { DeleteResourceButton, P, Row, text } from 'lib/index'
import { TComment } from 'lib/types/global'
import * as gql from 'lib/types/graphql-shema'
import { observer } from 'mobx-react-lite'
import { User } from 'models'
import moment from 'moment'
import { useState } from 'react'
import { orderStore } from '../stores/order.store'
import { commentsStore } from './store'
import { TextEditor } from './text-editor'

interface ICommentProps {
  data: TComment
  userID: number
  showDelete?: boolean
}

export function Comment({ data, userID }: ICommentProps) {
  const [deleteMutation] = gql.useDeleteCommentMutation()
  const [updateMutation] = gql.useUpdateCommentMutation()
  function updateComment(id: number, newText: string) {
    updateMutation({
      variables: {
        CommentID: id,
        Text: newText.trim()
      }
    })
  }
  function handleDelete() {
    deleteMutation({ variables: { CommentID: data.id } })
  }
  function sender() {
    return `${data.user.first_name} ${data.user.last_name}`
  }

  function timestamp() {
    const date = moment(data.created_at)
    return date.format('MMM D') + ' at ' + date.format('hh:mm')
  }
  function getCommentContent() {
    const isYourComment = userID === data.user.id
    return isYourComment ? (
      <div
        contentEditable="true"
        key={data.id}
        suppressContentEditableWarning={true}
        onBlur={async e => {
          await updateComment(data.id, e.target.innerHTML)
        }}
        onMouseLeave={async e => {
          await updateComment(data.id, e.currentTarget.innerHTML)
        }}
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: data.text }} />
    )
  }

  function actions() {
    if (orderStore.editMode && userID === data.user.id)
      return <DeleteResourceButton onClick={handleDelete} />
  }

  return (
    <Card sx={{ my: 0.5, p: 1, gap: 0.5 }} variant="outlined">
      <Row sx={{ justifyContent: 'space-between' }}>
        <P level="body-xs">
          <b>{sender()} </b>
        </P>
        <Row>
          <P level="body-xs"> {timestamp()} </P>
          <div>{actions()}</div>
        </Row>
      </Row>
      <Divider />
      <Box
        css={css`
          p {
            margin: 0;
          }
        `}
      >
        {getCommentContent()}
      </Box>
    </Card>
  )
}

interface ICommentsListProps {
  user: User
  orderId: number
}

export function CommentListViewPort({ user, orderId }: ICommentsListProps) {
  const { data, loading } = gql.useCommentsSubscription({
    variables: { OrderID: orderId }
  })
  const [visibleComments, setVisibleComments] = useState(5)

  // Sort comments from oldest to newest
  const sortedComments =
    data?.orders_comments.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ) || []

  // Always show the latest comments at the bottom
  const commentsToShow = sortedComments.slice(-visibleComments)

  const handleShowMore = () => {
    setVisibleComments(prev => prev + 15)
  }

  return (
    <Box>
      <Box sx={{ overflow: 'scroll' }}>
        {sortedComments.length > visibleComments && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button variant="soft" onClick={handleShowMore} size="sm">
              {text.showMore}
            </Button>
          </Box>
        )}

        {!loading &&
          commentsToShow.map(comment => (
            <Comment data={comment} key={comment.id} userID={user.id} />
          ))}
      </Box>
    </Box>
  )
}

export const CommentInputViewPort = observer(
  ({ user, orderId }: ICommentsListProps) => {
    return (
      <Box>
        <Box sx={{ overflow: 'scroll', py: 2 }}>
          <TextEditor
            placeholder="Введите комментарий"
            onSubmit={content => {
              return commentsStore.insertComment(content, orderId, user.id)
            }}
          />
        </Box>
      </Box>
    )
  }
)
