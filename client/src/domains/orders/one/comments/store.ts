import { makeAutoObservable } from 'mobx'

class CommentsStore {
  showMentionList = false

  constructor() {
    makeAutoObservable(this)
  }

  openUserList() {
    this.showMentionList = true
  }

  closeUserList() {
    this.showMentionList = false
  }

  async insertComment(comment: string, orderId: number, userId: number) {
    const document = new DOMParser().parseFromString(comment, 'text/html')
    const mentioned = Array.from(document.querySelectorAll('span.mention'))
    const mentionedUsersIds = mentioned
      .map(e => Number(e.getAttribute('data-id')))
      .filter(e => !isNaN(e))

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

    const commentId = res.data?.insert_orders_comments_one?.id
    if (!commentId) throw Error('failed to insert comment')

    for (const mentionedUserId of mentionedUsersIds) {
      await apolloClient.mutate<
        gql.InsertNotificationMutation,
        gql.InsertNotificationMutationVariables
      >({
        mutation: gql.InsertNotificationDocument,
        variables: {
          comment_id: commentId,
          user_id: mentionedUserId,
          order_id: orderId
        }
      })
    }
  }
}

export const commentsStore = new CommentsStore()
