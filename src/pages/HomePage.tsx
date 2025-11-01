import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import MainHeader from "@/components/layout/MainHeader";
import CourseCard from "@/components/cards/CourseCard";
import { categories, mockContents, tabFilters } from "@/data/content";
import AuthStatus from "@/features/auth/AuthStatus";
import styles from "./HomePage.module.css";

const HomePage = () => {
  // 默认展示全部：不选中任何具体分类
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState(tabFilters[0].id);

  const filteredContents = useMemo(() => {
    const base = !activeCategory ? mockContents : mockContents.filter(item => item.category === activeCategory);
    if (activeFilter === "popular") {
      return [...base].sort((a, b) => b.views - a.views);
    }
    return [...base].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeCategory, activeFilter]);

  // 仅保留瀑布流 Feed 展示全部内容

  return (
    <AppLayout
      header={
        <MainHeader
          headline="知光 · 让知识发光"
          subtitle="精选实用好课，陪你成为更好的自己"
          tabs={categories.map(cat => ({
            id: cat,
            label: cat,
            active: activeCategory === cat,
            onSelect: setActiveCategory
          }))}
          filters={tabFilters.map(filter => ({
            ...filter,
            active: activeFilter === filter.id,
            onSelect: setActiveFilter
          }))}
          rightSlot={<AuthStatus />}
        />
      }
    >
      <div className={styles.masonry}>
        {filteredContents.map(item => (
          <div key={item.id} className={styles.masonryItem}>
            <CourseCard
              id={item.id}
              title={item.title}
              summary={item.summary}
              tags={item.tags}
              isFree={item.isFree}
              teacher={{ name: item.mentor.name, avatarText: item.mentor.name.charAt(0) }}
              stats={{ likes: item.likes, views: item.views }}
              coverImage={item.coverImage}
              layout={item.coverImage ? "horizontal" : "vertical"}
              showPlayBadge={item.kind === "video"}
              to={`/course/${item.id}`}
            />
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default HomePage;
