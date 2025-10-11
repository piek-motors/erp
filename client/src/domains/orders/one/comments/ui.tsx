/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Button, Card, Divider } from '@mui/joy'
import { DeleteResourceButton, P, Row, text } from 'lib/index'
import { rpc } from 'lib/rpc.client'
import { observer } from 'mobx-react-lite'
import { User } from 'models'
import moment from 'moment'
import { useState } from 'react'
import { OrderComment } from 'srv/rpc/orders/comments'
import { orderStore } from '../order.store'
import { TextEditor } from './text-editor'

interface ICommentProps {
  data: OrderComment
  userID: number
  showDelete?: boolean
}

export function Comment({ data, userID }: ICommentProps) {
  function updateComment(id: number, newText: string) {
    rpc.orders.comments.update.mutate({
      id,
      text: newText.trim()
    })
  }
  function handleDelete() {
    rpc.orders.comments.delete.mutate({
      id: data.id
    })
  }
  function sender() {
    return `${data.first_name} ${data.last_name}`
  }

  function timestamp() {
    const date = moment(data.created_at)
    return date.format('MMM D') + ' at ' + date.format('hh:mm')
  }
  function getCommentContent() {
    const isYourComment = userID === data.user_id
    return isYourComment ? (
      <div
        style={{ padding: '5px' }}
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
    if (orderStore.editMode && userID === data.user_id)
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
            font-size: 14px;
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

export const CommentListViewPort = observer(
  ({ user, orderId }: ICommentsListProps) => {
    const [visibleComments, setVisibleComments] = useState(5)

    const sortedComments =
      orderStore.comments.comments
        .slice()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
        {!orderStore.comments.loading &&
          commentsToShow.map(comment => (
            <Comment data={comment} key={comment.id} userID={user.id} />
          ))}
      </Box>
    )
  }
)

export const CommentInputViewPort = observer(
  ({ user, orderId }: ICommentsListProps) => {
    return (
      <Card
        variant="soft"
        sx={{ p: 1, pt: 0, position: 'sticky', bottom: 8 }}
        size="sm"
      >
        <TextEditor
          placeholder="Начините обсуждение"
          onSubmit={content =>
            orderStore.comments
              .insertComment(content, orderId, user.id)
              .then(() => {
                orderStore.loadOrder(orderId)
              })
          }
        />
      </Card>
    )
  }
)
