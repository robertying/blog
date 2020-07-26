import dayjs from "dayjs";

const Date: React.FC<{ dateString: string }> = ({ dateString }) => {
  return (
    <time dateTime={dateString}>{dayjs(dateString).format("MMM D, YYYY")}</time>
  );
};

export default Date;
