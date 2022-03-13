import { Injectable } from '@angular/core';
import {Post} from './posts.model';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import {environment} from "../../environments/environment"

const BACKEND_URL=environment.API_URL+'/posts';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  userPostSub = new Subject<{posts: Post[], maxPosts : number}>();
  posts:Post[] =[];
  maxPosts:number;
  userID:string;

  constructor(private http: HttpClient,private authSer:AuthService) {
    this.userID = this.authSer.getUserID();
   }

  getPosts(postsPerPage:number , currentPage:number){
    const queryParams =   `?pagesize=${postsPerPage}&currentpage=${currentPage}`
    this.http.get<{message: string, maxPosts:number , data: any}>(BACKEND_URL + queryParams)
    .pipe(map( postdata =>{
      this.maxPosts = postdata.maxPosts;
      return postdata.data.map((el:any)=>{
        return{
          id: el._id,
          title: el.title,
          content:el.content,
          creator: el.creator,
        }
      });
    }))
    .subscribe(
      serPosts =>{
        this.posts = serPosts;
        this.userPostSub.next({posts: this.posts, maxPosts: this.maxPosts});
      }
    )
  }

  getUserPostsSub(){
    return this.userPostSub.asObservable();
  }

  getPost(id:string){
    return this.http.get<{message: string, data: any}>(BACKEND_URL+'/' + id)
    // return {...this.posts.find(post => post.id === id)}
  }

  updatePost(id:string, title:string,content:string){
    //use put to update
    const post = {
      id : id,
      title : title,
      content : content,
    }
    this.http.put(BACKEND_URL+'/' + id, post).subscribe((res:{message:string})=>{
      console.log(res.message);

    })
  }

  addPost( title:string,content:string){
    const post:Post = {
      id: null,
      title: title,
      content: content,
      creator: this.userID,
    }
    this.http.post<{message:string, postID:string}>(BACKEND_URL, post).subscribe((data)=>{
      console.log(data.message);
      post.id = data.postID
      this.posts.push(post);
      this.userPostSub.next({posts: this.posts, maxPosts: this.maxPosts});

  })
  }

  deletePost(postID:string){
    this.http.delete(BACKEND_URL+'/' + postID)
    .subscribe(
      (postData:{message:string,maxPosts:number})=>{
        console.log(postData);
        const updatedPost = this.posts.filter((post) => post.id!==postID);
        this.posts=updatedPost;
        this.maxPosts = postData.maxPosts;
        this.userPostSub.next({posts: this.posts, maxPosts: this.maxPosts});
        }
    )
  }
}
