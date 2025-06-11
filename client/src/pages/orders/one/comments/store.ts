import { apolloClient } from 'lib/api'
import { makeAutoObservable } from 'mobx'
import * as gql from 'types/graphql-shema'

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

    // extract all span elements with mention class
    // <p><span class="mention" data-type="mention" data-id="18" data-label="Эдуард Лосеев">@Эдуард Лосеев</span> df</p><p>d</p><p>fdf</p><p>dfdf</p>

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
}

export const commentsStore = new CommentsStore()
