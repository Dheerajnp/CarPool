import {
    Card,
    CardContent,
  } from "../ui/card";
const TestimonialCard = ({ text, author }:{text:string,author:string}) => (
    <Card className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <CardContent>
        <p className="text-lg text-gray-600 dark:text-gray-300">{text}</p>
        <p className="text-lg text-gray-900 dark:text-white font-bold">{author}</p>
      </CardContent>
    </Card>
  );

  export default TestimonialCard;