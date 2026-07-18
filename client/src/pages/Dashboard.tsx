import { DashboardUI } from './DashboardUI'
import { useMapLogic } from '../hooks/useMapLogic'

export default function Dashboard() {
  useMapLogic();

  return (
    <>
      <DashboardUI />
    </>
  )
}
