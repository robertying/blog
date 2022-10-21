import dayjs from "dayjs";

export interface DateProps {
  className?: string;
  dateString: string;
}

const Date: React.FC<React.PropsWithChildren<DateProps>> = ({
  className,
  dateString,
}) => {
  return (
    <time className={className} dateTime={dateString}>
      {dayjs(dateString).format("MMM D, YYYY")}
    </time>
  );
};

export default Date;
