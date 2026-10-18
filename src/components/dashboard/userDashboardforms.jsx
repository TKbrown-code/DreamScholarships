import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/Supabase';
import ErrorBoundary from '../../context/ErrorBoundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';


function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // redirect after logout
  };

  return (
    <button onClick={handleLogout}>
     <FontAwesomeIcon icon={faSignOut}/> Sign Out
    </button>
  );
}

function DashboardForms() {
  return (
    <>
       
      <ErrorBoundary>
          <Logout/>
      </ErrorBoundary>
    </>
  );
}

export default DashboardForms;
