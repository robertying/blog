import dayjs from "dayjs";

export interface DateProps {
  dateString: string;
}

const Date: React.FC<DateProps> = ({ dateString }) => {
  return (
    <time dateTime={dateString}>{dayjs(dateString).format("MMM D, YYYY")}</time>
  );
};

export default Date;
