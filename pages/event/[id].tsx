import { GetServerSideProps } from "next";

type EventPageProps = {
  id?: string;
  errors?: any;
};
const EventPage = ({ id, errors }: EventPageProps) => {
  return <></>;
};

export default EventPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id;
    return { props: { id } };
  } catch (error) {
    return { props: { errors: error.message } };
  }
};
