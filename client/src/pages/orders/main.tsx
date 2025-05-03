import { PageTitle } from '../../components'
import { AddButton, MyTabs } from '../../shortcuts'
import { Archive } from './archive'
import { Production } from './production'
import { RecentOrders } from './recently'
import { Registration } from './registration'
import { Report } from './report'

export function Orders() {
  function handleAddOrder() {
    alert('add order')
  }

  return (
    <>
      <PageTitle title="Заказы | Очередность выполнения">
        <AddButton onClick={handleAddOrder} />
      </PageTitle>
      <MyTabs
        tabs={{
          Предзаказы: <Registration />,
          'В производстве': <Production />,
          'Недавние заказы': <RecentOrders />,
          Архив: <Archive />,
          Отчет: <Report />
        }}
      />
    </>
  )
}
