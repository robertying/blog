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
      {/* Format the calendar date as written. Parsing the full timestamp would
          shift it into the build machine's timezone (UTC), moving evening posts
          to the next day. */}
      {dayjs(dateString.slice(0, 10)).format("MMM D, YYYY")}
    </time>
  );
};

export default Date;
