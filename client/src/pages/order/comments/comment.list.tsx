import { UilListUl, UilMessage, UilUser } from '@iconscout/react-unicons'
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Textarea,
  Tooltip,
  Typography
} from '@mui/joy'
import { apolloClient } from 'api'
import { Observer } from 'mobx-react-lite'
import moment from 'moment'
import { useOrderDetailStore } from 'pages/order/state'
import React, { useRef, useState } from 'react'
import {
  DeleteResourceButton,
  ICON_OPACITY,
  ICON_WIDTH,
  Row,
  text
} from 'shortcuts'
import { TComment, TUser } from 'types/global'
import {
  InsertCommentDocument,
  InsertCommentMutation,
  InsertCommentMutationVariables,
  useCommentsSubscription,
  useDeleteCommentMutation,
  useGetAllUsersQuery,
  useInsertCommentMutation,
  useInsertNotificationMutation,
  useUpdateCommentMutation
} from 'types/graphql-shema'
import { orderStore } from '../order.store'
import { UserListPopover } from './user-list.popover'

async function insertComment(comment: string, orderId: number, userId: number) {
  const res = await apolloClient.mutate<
    InsertCommentMutation,
    InsertCommentMutationVariables
  >({
    mutation: InsertCommentDocument,
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

function InputForm({ insertComment, inputRef }: InputFormProps) {
  const { data: users } = useGetAllUsersQuery()
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
        users={users?.erp_Users || []}
        inputRef={inputRef}
      />
      <Stack flexGrow={1}>
        <Textarea
          size="sm"
          variant="soft"
          color="neutral"
          onChange={handleChange}
          value={value}
          placeholder="Комментарий к заказу"
        />
      </Stack>
      <Box>
        <InsertCommentButton
          onClick={() => {
            const temp = value
            setData('')
            insertComment(temp)
          }}
        />
      </Box>
    </Row>
  )
}

function InsertCommentButton(props: { onClick: () => void }) {
  return (
    <Tooltip title="Прикрепить комментарий">
      <IconButton onClick={props.onClick}>
        <UilMessage width={ICON_WIDTH} opacity={ICON_OPACITY} />
      </IconButton>
    </Tooltip>
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
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      placement="bottom-start"
      sx={{ p: 1 }}
    >
      <MenuItem
        onClick={() => {
          handleClose()
          insertTodoinDOM()
        }}
      >
        <UilListUl />
        Чеклист
      </MenuItem>
      <MenuItem onClick={mentionHandler}>
        <UilUser />
        Упомянуть
      </MenuItem>
    </Menu>
  )
}

interface ICommentProps {
  data: TComment
  userID: number
  showDelete?: boolean
}

export function Comment({ data, userID }: ICommentProps) {
  const [deleteMutation] = useDeleteCommentMutation()
  const [updateMutation] = useUpdateCommentMutation()
  function updateComment(id: number, newText: string) {
    updateMutation({
      variables: {
        CommentID: id,
        Text: newText.trim()
      }
    })
  }
  function handleDelete() {
    deleteMutation({ variables: { CommentID: data.CommentID } })
  }
  function sender() {
    return `${data.User.FirstName} ${data.User.LastName}`
  }

  function timestamp() {
    const date = moment(data.Timestamp)
    return date.format('MMM D') + ' at ' + date.format('hh:mm')
  }
  function getCommentContent() {
    const isYourComment = userID === data.User.UserID
    return isYourComment ? (
      <div
        style={{
          fontSize: '0.8rem'
        }}
        contentEditable="true"
        key={data.CommentID}
        suppressContentEditableWarning={true}
        onBlur={async e => {
          await updateComment(data.CommentID, e.target.innerHTML)
        }}
        onMouseLeave={async e => {
          await updateComment(data.CommentID, e.currentTarget.innerHTML)
        }}
        dangerouslySetInnerHTML={{ __html: data.Text }}
      />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: data.Text }} />
    )
  }

  return (
    <Observer
      render={() => {
        function actions() {
          if (orderStore.editMode && userID === data.User.UserID)
            return <DeleteResourceButton onClick={handleDelete} />
        }

        return (
          <Card sx={{ my: 0.5, p: 1, gap: 0.5 }} variant="outlined">
            <Row sx={{ justifyContent: 'space-between' }}>
              <Typography level="body-xs">
                <b>{sender()} </b>
              </Typography>
              <Row>
                <Typography level="body-xs"> {timestamp()} </Typography>
                <div>{actions()}</div>
              </Row>
            </Row>
            <Divider />
            {getCommentContent()}
          </Card>
        )
      }}
    />
  )
}

interface ICommentsListProps {
  user: TUser
}

export function CommentListViewPort({ user }: ICommentsListProps) {
  const { orderId } = useOrderDetailStore()
  if (!orderId) throw Error('Null OrderId at the local store')
  const [insertOrderCommentMutation] = useInsertCommentMutation()
  const [insertNotificationMutation] = useInsertNotificationMutation()
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, loading } = useCommentsSubscription({
    variables: { OrderID: orderId }
  })
  const [visibleComments, setVisibleComments] = useState(5)

  // Sort comments from oldest to newest
  const sortedComments =
    data?.erp_Comments.sort(
      (a, b) =>
        new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
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
            <Comment
              data={comment}
              key={comment.CommentID}
              userID={user.UserID}
            />
          ))}
      </Box>
    </Box>
  )
}

export function CommentInputViewPort({ user }: ICommentsListProps) {
  const { orderId } = useOrderDetailStore()
  if (!orderId) throw Error('Null OrderId at the local store')
  const inputRef = useRef<any>(null)
  return (
    <Box>
      <Box sx={{ overflow: 'scroll', py: 2 }}>
        <InputForm
          insertComment={async comment => {
            insertComment(comment, orderId, user.UserID)
          }}
          inputRef={inputRef}
        />
      </Box>
    </Box>
  )
}
