import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

interface PostCard {
  id: number;
  title: string;
  content: string;
  likes: number;
  username: string;
  about: string;
  updatedAt: Date;
  createdAt: Date;
  status: 1;
  liked: boolean;
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  postCards: PostCard[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const headers = this.authService.getHeaders();
    this.http
      .get<PostCard[]>('http://localhost:8080/api/posts/', { headers })
      .subscribe(
        (data) => {
          this.postCards = data;
        },
        (error) => {
          console.error('Problem while fetching data', error);
        }
      );
  }

  giveLike(postId: number): void {
    const likeData = {
      postId: postId,
    };
    const headers = this.authService.getHeaders();

    this.http
      .post<any>(
        'http://localhost:8080/api/posts/' + postId + '/like',
        likeData,
        {
          headers,
        }
      )
      .subscribe(
        (response) => {
          const post = this.postCards.find((post) => post.id === postId);
          if (post) {
            post.liked = true;
          }
        },
        (error) => {
          console.error('Problem with liking post', error);
          if (error.error.message === 'Post already liked') {
            const post = this.postCards.find((post) => post.id === postId);
            if (post) {
              post.liked = true;
            }
          }
        }
      );
  }

  removeLike(postId: number): void {
    const likeData = {
      postId: postId,
    };
    const headers = this.authService.getHeaders();
    this.http
      .post<any>(
        'http://localhost:8080/api/posts/' + postId + '/unlike',
        likeData,
        {
          headers,
        }
      )
      .subscribe(
        (response) => {
          const post = this.postCards.find((post) => post.id === postId);
          if (post) {
            post.liked = false;
          }
        },
        (error) => {
          console.error('Problem with liking post', error);
        }
      );
  }

  isLiked(postId: number): boolean {
    const post = this.postCards.find((post) => post.id === postId);

    if (post) {
      if (post.hasOwnProperty('liked')) {
        return post.liked;
      }
    }
    return false;
  }

  deletePost(postId: number): void {
    const headers = this.authService.getHeaders();
    this.http
      .delete<any>('http://localhost:8080/api/posts/' + postId, { headers })
      .subscribe(
        (respond) => {
          location.reload();
        },
        (error) => {
          console.error('Problem while deleting post', error);
        }
      );
  }
}
