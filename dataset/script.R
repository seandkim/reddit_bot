
# Define Path
comments_dataset_path <- "Roastme-2017-01/comment.csv"
post_dataset_path <- "Roastme-2017-01/post.csv"
file_name <- "joint/Roastme-joint-2017-01.csv"

# read library
#library(readr)
#library(dplyr)

# Read data
comment <- read_csv(comments_dataset_path)
post <- read_csv(post_dataset_path)

# Skim 
comment_skimmed <- comment[, c("body", "link_id", "score")]
post_skimmed <- post[, c("num_comments", "score", "title", "id")]

link_id_truncated <- as.vector(sapply(comment_skimmed$link_id, substr, 4, 9))
comment_skimmed$post_id <- link_id_truncated

colnames(post_skimmed)[4] <- "post_id"

# Join Table
joint <- merge(post_skimmed, comment_skimmed, sort = FALSE)
joint <- joint[, -6]

# remove inapproprate comments
ind <- which(grepl("^Hi /u/", joint$body))
joint <- joint[-ind, ]

ind_deleted <- which(joint$body == '[deleted]')
joint <- joint[-ind_deleted, ]
View(joint)

# Write CSV
write_csv(joint, file_name)

