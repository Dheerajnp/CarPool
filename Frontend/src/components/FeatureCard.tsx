import { FC } from "react";
import { IconType } from "react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}
const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <Card className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center">
    <CardHeader className="flex flex-col items-center gap-0">
      <Icon size={48} className="text-blue-400" />
      <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white text-center">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-lg text-gray-600 dark:text-gray-300 text-center">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

export default FeatureCard;
