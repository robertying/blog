import dayjs from "dayjs";

const MyDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  return (
    <time dateTime={dateString}>{dayjs(dateString).format("MMM D, YYYY")}</time>
  );
};

export default MyDate;
