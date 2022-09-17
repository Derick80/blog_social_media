import { Link } from "@remix-run/react";
import Icon from "~/components/shared/icon";

export interface CategoryContainerProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
  isPost: boolean;
}

export default function CategoryContainer({
  categories,
  isPost,
}: CategoryContainerProps) {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <div>
            <Link to={`/categories/${category.name}`}>{category.name}</Link>
          </div>
          {isPost ? (
            <div>
              <div>
                <button className="" action="_action" value="removeCategory">
                  <Icon icon="close" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
