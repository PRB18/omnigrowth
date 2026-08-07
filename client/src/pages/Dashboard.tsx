import { DashboardUI } from './DashboardUI'
import { useMapLogic } from '../hooks/useMapLogic'

export default function Dashboard() {
  const { districtListings, isLoadingListings } = useMapLogic();

  return (
    <DashboardUI
      districtListings={districtListings}
      isLoadingListings={isLoadingListings}
    />
  );
}