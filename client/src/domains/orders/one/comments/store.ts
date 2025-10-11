import { rpc } from 'lib/rpc.client'
import { makeAutoObservable } from 'mobx'
import { OrderComment } from 'srv/rpc/orders/comments'

export class CommentsStore {
  showMentionList = false
  comments: OrderComment[] = []
  loading = false
  constructor() {
    makeAutoObservable(this)
  }
  openUserList() {
    this.showMentionList = true
  }
  closeUserList() {
    this.showMentionList = false
  }
  setComments(comments: OrderComment[]) {
    this.comments = comments
  }
  async insertComment(comment: string, orderId: number, userId: number) {
    const document = new DOMParser().parseFromString(comment, 'text/html')
    const mentioned = Array.from(document.querySelectorAll('span.mention'))
    const mentionedUsersIds = mentioned
      .map(e => Number(e.getAttribute('data-id')))
      .filter(e => !isNaN(e))
    const res = await rpc.orders.comments.insert.mutate({
      order_id: orderId,
      text: comment,
      user_id: userId
    })
    const commentId = res.id
    if (!commentId) throw Error('failed to insert comment')
    for (const mentionedUserId of mentionedUsersIds) {
      await rpc.orders.mentions.insert.mutate({
        order_id: orderId,
        user_id: mentionedUserId,
        comment_id: commentId
      })
    }
  }
}
