// src/app/dashboard/page.tsx
import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import { verifyIdToken } from '@/lib/firebaseAdmin';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    const token = cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Verify token using Firebase Admin SDK
    const decodedToken = await verifyIdToken(token);

    return {
      props: { user: decodedToken }, // Pass user data to the page
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

const Dashboard = ({ user }: { user: any }) => {
  return (
    <div>
      <h1>Welcome to the Dashboard, {user.email}!</h1>
      {/* Rest of your dashboard content */}
    </div>
  );
};

export default Dashboard;
