import { SideBarA } from '../components/SideBarA';
import { SideBarB } from '../components/SideBarB';
import { EditProfileCenterBar } from '../components/EditProfileCenterBar';
import { useRecommendedUsers } from '../hooks/useRecommendedUsers';

export function EditProfilePage() {
    
    const recommendedUsers = useRecommendedUsers();

    return (
        <main>
            <SideBarA />
            <EditProfileCenterBar />
            <SideBarB users={recommendedUsers} />
        </main>
    );
}