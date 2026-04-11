const RegisterIntroductionPage = () => {
  return null;
};

export const getServerSideProps = async () => ({
  redirect: {
    destination: "/tutorial/introduction",
    permanent: false,
  },
});

export default RegisterIntroductionPage;
