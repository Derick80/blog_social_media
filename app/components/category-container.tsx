import { Link } from "@remix-run/react";
import Icon from "~/components/shared/icon";

export interface CategoryContainerProps {
  category: {
    id: string;
    name: string;
  }
}

export default function CategoryContainer ({
  category,
}: CategoryContainerProps) {
  return (
    <div>

      <div key={ category.id }>
        <div>
          <Link to={ `/categories/${category.name}` }>{ category.name }</Link>
        </div>

      </div>

    </div>
  );
}
