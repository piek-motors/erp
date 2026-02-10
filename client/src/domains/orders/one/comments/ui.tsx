/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { Box, Button, Card, Divider } from '@mui/joy'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import { useState } from 'react'
import { DeleteIcon, P, Row, text } from '@/lib/index'
import { rpc } from '@/lib/rpc/rpc.client'
import type { User } from '@/lib/store/auth.store'
import type { OrderComment } from '@/server/domains/orders/comments_rpc'
import { orderStore } from '../order.store'
import { TextEditor } from './text-editor'

interface ICommentProps {
  comment: OrderComment
  userID: number
  showDelete?: boolean
}

export const Comment = observer(({ comment, userID }: ICommentProps) => {
  function updateComment(id: number, newText: string) {
    rpc.orders.comments.update.mutate({
      id,
      text: newText.trim(),
    })
  }
  async function handleDelete() {
    await rpc.orders.comments.delete.mutate({
      id: comment.id,
    })
    orderStore.comments.delete(comment.id)
  }
  function sender() {
    return `${comment.first_name} ${comment.last_name}`
  }

  function timestamp() {
    const date = moment(comment.created_at)
    return date.format('D MMM YY') + ' ' + date.format('hh:mm')
  }
  function getCommentContent() {
    const isYourComment = userID === comment.user_id
    return isYourComment ? (
      <div
        style={{ padding: '5px' }}
        contentEditable="true"
        key={comment.id}
        suppressContentEditableWarning={true}
        onBlur={e => updateComment(comment.id, e.target.innerHTML)}
        onMouseLeave={e => updateComment(comment.id, e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: comment.text }} />
    )
  }

  function actions() {
    if (orderStore.editMode && userID === comment.user_id)
      return <DeleteIcon onClick={handleDelete} />
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
            font-size: 14px;
          }
        `}
      >
        {getCommentContent()}
      </Box>
    </Card>
  )
})

interface ICommentsListProps {
  user: User
  orderId: number
}

export const CommentListViewPort = observer(({ user }: ICommentsListProps) => {
  const [visibleComments, setVisibleComments] = useState(5)
  const sortedComments =
    orderStore.comments.comments
      .slice()
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ) || []
  const commentsToShow = sortedComments.slice(-visibleComments)
  const handleShowMore = () => {
    setVisibleComments(prev => prev + 15)
  }
  return (
    <Box>
      {sortedComments.length > visibleComments && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button variant="soft" onClick={handleShowMore} size="sm">
            {text.showMore}
          </Button>
        </Box>
      )}
      {commentsToShow.map(comment => (
        <Comment comment={comment} key={comment.id} userID={user.id} />
      ))}
    </Box>
  )
})

export const CommentInputViewPort = observer(
  ({ user, orderId }: ICommentsListProps) => (
    <TextEditor
      placeholder="Начать обсуждение"
      onSubmit={content =>
        orderStore.comments
          .insertComment(content, orderId, user.id)
          .then(() => {
            orderStore.loadOrder(orderId)
          })
      }
    />
  ),
)
