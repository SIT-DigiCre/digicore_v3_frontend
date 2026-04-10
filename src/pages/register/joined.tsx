const RegisterJoinedPage = () => {
  return null;
};

export const getServerSideProps = async () => ({
  redirect: {
    destination: "/tutorial/joined",
    permanent: false,
  },
});

export default RegisterJoinedPage;
