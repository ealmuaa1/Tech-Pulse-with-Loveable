import { Topic } from "@/types";

export const filterTopicsByPreference = (
  allTopics: Topic[],
  favoriteTopics: string[]
): Topic[] => {
  if (
    !Array.isArray(allTopics) ||
    !Array.isArray(favoriteTopics) ||
    favoriteTopics.length === 0
  ) {
    return allTopics;
  }

  console.log("Filtering topics with preferences:", favoriteTopics);

  const filtered = allTopics.filter((topic) => {
    if (!topic) return false;

    const topicCategory = topic.category?.toLowerCase() || "";
    const topicTitle = topic.title?.toLowerCase() || "";
    const topicDescription = topic.description?.toLowerCase() || "";

    return favoriteTopics.some((userTopic) => {
      if (typeof userTopic !== "string") return false;
      const userTopicLower = userTopic.toLowerCase();

      return (
        topicCategory.includes(userTopicLower) ||
        topicTitle.includes(userTopicLower) ||
        topicDescription.includes(userTopicLower) ||
        userTopicLower.includes(topicCategory) ||
        userTopicLower.includes(topicTitle)
      );
    });
  });

  console.log(
    `Filtered ${filtered.length} topics from ${allTopics.length} total`
  );
  return filtered;
};
