import { check } from "express-validator";

// Common Validator for both post Like and Unlike Routes

exports.postLikeAndUnlikeValidator = [
    check('user_id', 'The user id is required.').not().isEmpty(),
    check('post_id', 'The post id is required.').not().isEmpty(),
]

exports.postLikeCountValidator = [
    check('post_id', 'The post id is required.').not().isEmpty(),
]