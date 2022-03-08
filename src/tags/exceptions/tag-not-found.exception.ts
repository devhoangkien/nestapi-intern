import { NotFoundException } from '@nestjs/common';

class TagNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`Tag with id ${postId} not found`);
  }
}

export default TagNotFoundException;
