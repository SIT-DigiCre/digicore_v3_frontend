const RegisterDiscordPage = () => {
  return null;
};

export const getServerSideProps = async () => ({
  redirect: {
    destination: "/tutorial/discord",
    permanent: false,
  },
});

export default RegisterDiscordPage;
