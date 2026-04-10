const RegisterPersonalPage = () => {
  return null;
};

export const getServerSideProps = async () => ({
  redirect: {
    destination: "/tutorial/personal-info",
    permanent: false,
  },
});

export default RegisterPersonalPage;
