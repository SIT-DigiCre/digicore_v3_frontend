const RegisterPublicPage = () => {
  return null;
};

export const getServerSideProps = async () => ({
  redirect: {
    destination: "/tutorial/public-profile",
    permanent: false,
  },
});

export default RegisterPublicPage;
