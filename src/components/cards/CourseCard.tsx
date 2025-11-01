import type { ReactNode } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import Tag from "@/components/common/Tag";
import { HeartIcon } from "@/components/icons/Icon";
import styles from "./CourseCard.module.css";

export type CourseCardProps = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  isFree?: boolean;
  teacher: {
    name: string;
    avatarText: string;
  };
  stats?: {
    likes: number;
    views: number;
  };
  coverImage?: string;
  layout?: "vertical" | "horizontal";
  showPlayBadge?: boolean;
  footerExtra?: ReactNode;
  to?: string;
  className?: string;
};

const CourseCard = ({
  title,
  summary,
  tags,
  isFree = true,
  teacher,
  stats,
  coverImage,
  layout = "vertical",
  showPlayBadge,
  footerExtra,
  to,
  className
}: CourseCardProps) => {
  const content = (
    <>
      {/* 取消免费标识展示，保持卡片简洁 */}
      {/* 图片置于卡片顶部，保持原始比例；播放标识覆盖在封面中央 */}
      {coverImage ? (
        <div className={styles.coverWrap}>
          <img className={styles.cover} src={coverImage} alt={title} loading="lazy" />
          {showPlayBadge ? (
            <div className={styles.playBadge}>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <polygon points="6,4 12,8 6,12" fill="currentColor" />
              </svg>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{summary}</p>
        <div className={styles.tagGroups}>
          {tags.map(tag => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.teacher}>
          <div className={styles.teacherAvatar}>{teacher.avatarText}</div>
          <div className={styles.teacherInfo}>
            <span className={styles.teacherName}>{teacher.name}</span>
            <span>授课导师</span>
          </div>
        </div>
        {footerExtra ?? (
          <div className={styles.stats}>
            {stats ? (
              <>
                <span className={styles.statItem}>
                  <HeartIcon width={16} height={16} strokeWidth={1.6} />
                  {stats.likes}
                </span>
                <span className={styles.statItem}>👁️ {stats.views}</span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </>
  );

  return (
    <article className={clsx(styles.card, className)}>
      {to ? <Link to={to}>{content}</Link> : content}
    </article>
  );
};

export default CourseCard;
