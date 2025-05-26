import { UilListUl, UilMessage, UilUser } from '@iconscout/react-unicons'
import * as joy from '@mui/joy'
import { apolloClient } from 'api'
import { User } from 'domain-model'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { DeleteResourceButton, Row, text, UseIcon } from 'shortcuts'
import { TComment } from 'types/global'
import * as gql from 'types/graphql-shema'
import { orderStore } from '../stores/order.store'
import { UserListPopover } from './user-list.popover'

async function insertComment(comment: string, orderId: number, userId: number) {
  const res = await apolloClient.mutate<
    gql.InsertCommentMutation,
    gql.InsertCommentMutationVariables
  >({
    mutation: gql.InsertCommentDocument,
    variables: {
      OrderID: orderId,
      Text: comment,
      UserID: userId
    }
  })

  // TODO: insert mentions
  // insertOrderCommentMutation({
  //   variables: {
  //     OrderID: orderId,
  //     UserID: user.UserID,
  //     Text: text
  //   }
  // }).then(res => {
  //   if (res.errors || !res.data?.insert_erp_Comments_one) {
  //     throw Error(res.errors?.toString() ?? 'broken responce')
  //   }
  //   const { CommentID, OrderID } = res.data?.insert_erp_Comments_one

  //   mentioned &&
  //     mentioned.forEach(el => {
  //       const mentionedUser = el.dataset.mentionedUser
  //       if (!mentionedUser) throw Error()

  //       insertNotificationMutation({
  //         variables: {
  //           CommentID,
  //           OrderID,
  //           MentionedUser: parseInt(mentionedUser)
  //         }
  //       })
  //     })
  // })
  // if (inputRef.current) inputRef.current.innerText = ''
}

interface InputFormProps {
  insertComment: (comment: string) => Promise<void>
  inputRef: React.RefObject<HTMLInputElement>
}

const InputForm = observer(({ insertComment, inputRef }: InputFormProps) => {
  const { data: users } = gql.useGetAllUsersQuery()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [anchorULP, setAnchorULP] = useState<Element | null>(null)

  const [value, setData] = useState<string>('')

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const innerText = e.target.value
    if (innerText.at(-1) === '/') {
      setAnchorEl(e.target as any)
    }
    if (innerText.at(-1) === '@') {
      setAnchorULP(e.target as any)
    }
    setData(innerText)
  }

  const handleClose = () => setAnchorEl(null)
  const handleCloseUserListPopover = () => setAnchorULP(null)
  return (
    <Row>
      <СommandListPopover
        setAnchorULP={setAnchorULP}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        handleClose={handleClose}
        inputRef={inputRef}
      />
      <UserListPopover
        anchorEl={anchorULP}
        open={Boolean(anchorULP)}
        handleClose={handleCloseUserListPopover}
        users={users?.users || []}
        inputRef={inputRef}
      />
      <joy.Stack flexGrow={1}>
        <joy.Textarea
          size="sm"
          variant="soft"
          color="neutral"
          onChange={handleChange}
          value={value}
          placeholder="Комментарий к заказу"
        />
      </joy.Stack>
      <joy.Box>
        <InsertCommentButton
          onClick={() => {
            const temp = value
            setData('')
            insertComment(temp)
          }}
        />
      </joy.Box>
    </Row>
  )
})

function InsertCommentButton(props: { onClick: () => void }) {
  return (
    <joy.Tooltip title="Прикрепить комментарий">
      <joy.IconButton onClick={props.onClick}>
        <UseIcon icon={UilMessage} />
      </joy.IconButton>
    </joy.Tooltip>
  )
}

interface IСommandsPopoverProps {
  anchorEl: Element | null
  open: boolean
  handleClose: () => void
  inputRef: React.RefObject<HTMLInputElement>
  setAnchorULP: React.Dispatch<React.SetStateAction<Element | null>>
}

export default function СommandListPopover({
  anchorEl,
  open,
  handleClose,
  setAnchorULP,
  inputRef
}: IСommandsPopoverProps) {
  function insertTodoinDOM() {
    const root = document.getElementById('Comments_InputForm')
    const elem = document.createElement('div')
    elem.setAttribute('data-testid', 'checkListUnit')
    root?.appendChild(elem)
  }

  function mentionHandler() {
    handleClose()
    setAnchorULP(inputRef.current)
  }

  return (
    <joy.Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      placement="bottom-start"
      sx={{ p: 1 }}
    >
      <joy.MenuItem
        onClick={() => {
          handleClose()
          insertTodoinDOM()
        }}
      >
        <UilListUl />
        Чеклист
      </joy.MenuItem>
      <joy.MenuItem onClick={mentionHandler}>
        <UilUser />
        Упомянуть
      </joy.MenuItem>
    </joy.Menu>
  )
}

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
        style={{
          fontSize: '0.8rem'
        }}
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
    <joy.Card sx={{ my: 0.5, p: 1, gap: 0.5 }} variant="outlined">
      <Row sx={{ justifyContent: 'space-between' }}>
        <joy.Typography level="body-xs">
          <b>{sender()} </b>
        </joy.Typography>
        <Row>
          <joy.Typography level="body-xs"> {timestamp()} </joy.Typography>
          <div>{actions()}</div>
        </Row>
      </Row>
      <joy.Divider />
      {getCommentContent()}
    </joy.Card>
  )
}

interface ICommentsListProps {
  user: User
  orderId: number
}

export function CommentListViewPort({ user, orderId }: ICommentsListProps) {
  const [insertOrderCommentMutation] = gql.useInsertCommentMutation()
  const [insertNotificationMutation] = gql.useInsertNotificationMutation()
  const inputRef = useRef<HTMLInputElement>(null)

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
    <joy.Box>
      <joy.Box sx={{ overflow: 'scroll' }}>
        {sortedComments.length > visibleComments && (
          <joy.Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <joy.Button variant="soft" onClick={handleShowMore} size="sm">
              {text.showMore}
            </joy.Button>
          </joy.Box>
        )}

        {!loading &&
          commentsToShow.map(comment => (
            <Comment data={comment} key={comment.id} userID={user.id} />
          ))}
      </joy.Box>
    </joy.Box>
  )
}

export function CommentInputViewPort({ user, orderId }: ICommentsListProps) {
  const inputRef = useRef<any>(null)
  return (
    <joy.Box>
      <joy.Box sx={{ overflow: 'scroll', py: 2 }}>
        <InputForm
          insertComment={async comment => {
            insertComment(comment, orderId, user.id)
          }}
          inputRef={inputRef}
        />
      </joy.Box>
    </joy.Box>
  )
}
