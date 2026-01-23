import { Button } from '@mui/joy'
import { InModal } from 'components/modal'
import { observer } from 'mobx-react-lite'
import { type ReactNode, useCallback, useState } from 'react'
import { useEscapeClose } from '../../../hooks/use-escape-close'
import { OperationsTable, OperationsTitle } from './list'

type OperationModalProps = {
	children: React.ReactNode
	open: boolean
	setOpen: (open: boolean) => void
	openButton: ReactNode
}

export const OperationModal = observer(
	({ children, open, setOpen, openButton }: OperationModalProps) => {
		const handleClose = useCallback(() => {
			setOpen(false)
		}, [])
		useEscapeClose(open, handleClose)
		return (
			<InModal
				size="sm"
				openButton={openButton}
				open={open}
				setOpen={o => setOpen(o)}
			>
				{children}
			</InModal>
		)
	},
)

export const OperationsListModal = observer(
	(props: { materialId?: number; detailId?: number }) => {
		const [open, setOpen] = useState(false)
		const handleClose = useCallback(() => {
			setOpen(false)
		}, [])
		useEscapeClose(open, handleClose)
		return (
			<InModal
				open={open}
				layout="fullscreen"
				setOpen={open => {
					setOpen(open)
				}}
				openButton={
					<Button fullWidth variant="outlined" color="neutral" size="md">
						Журнал
					</Button>
				}
			>
				<>
					<OperationsTitle />
					<OperationsTable
						materialId={props.materialId}
						detailId={props.detailId}
					/>
				</>
			</InModal>
		)
	},
)
