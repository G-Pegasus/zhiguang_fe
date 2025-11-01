import AppLayout from "@/components/layout/AppLayout";
import MainHeader from "@/components/layout/MainHeader";
import SectionHeader from "@/components/common/SectionHeader";
import Select from "@/components/common/Select";
import { useState } from "react";
import AuthStatus from "@/features/auth/AuthStatus";
import styles from "./CreatePage.module.css";

const CreatePage = () => {
  const [type, setType] = useState("图文笔记");
  const [category, setCategory] = useState("编程开发");
  const [series, setSeries] = useState<string>("");
  return (
    <AppLayout
      header={
        <MainHeader
          headline="创建新内容"
          subtitle="分享你的知识，让更多人受益"
          rightSlot={<AuthStatus />}
        />
      }
    >
      <div className={styles.formCard}>
        <SectionHeader title="基本信息" subtitle="精准描述你的内容，帮助同学快速了解" />
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              标题 *
            </label>
            <input id="title" className={styles.input} placeholder="输入内容标题" />
          </div>
          <Select
            id="type"
            label="内容类型 *"
            value={type}
            onChange={setType}
            options={[
              { label: "图文笔记", value: "图文笔记" },
              { label: "视频课程", value: "视频课程" },
              { label: "音频课程", value: "音频课程" }
            ]}
          />
          <Select
            id="category"
            label="分类 *"
            value={category}
            onChange={setCategory}
            options={[
              { label: "编程开发", value: "编程开发" },
              { label: "设计灵感", value: "设计灵感" },
              { label: "商业增长", value: "商业增长" },
              { label: "语言学习", value: "语言学习" }
            ]}
          />
          <Select
            id="series"
            label="关联专栏"
            value={series}
            onChange={setSeries}
            options={[
              { label: "选择一个专栏", value: "" },
              { label: "AI Coding 体验之旅", value: "coding" },
              { label: "产品实践工作坊", value: "product" }
            ]}
          />
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label}>图片（多选） *</label>
            <div className={styles.uploadBox}>
              <span>拖拽或点击上传图片</span>
              <small>支持 JPG / PNG / SVG，单张不超过 5MB</small>
            </div>
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="content">
              内容正文 *
            </label>
            <textarea id="content" className={styles.textarea} placeholder="写下你的知识内容..." />
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="product">
              关联商品（用于引导购内容）
            </label>
            <input id="product" className={styles.input} placeholder="商品标题" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-price">
              价格
            </label>
            <input id="product-price" className={styles.input} type="number" min="0" step="0.1" defaultValue="0" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tags">
              标签
            </label>
            <input id="tags" className={styles.input} placeholder="输入标签按回车添加" />
          </div>
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <div className={styles.toggle}>
              <div>
                <div className={styles.label}>免费分享</div>
                <small>免费内容将用于引流，可关联付费商品</small>
              </div>
              <div className={styles.switch} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.submit}>
            发布
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreatePage;
