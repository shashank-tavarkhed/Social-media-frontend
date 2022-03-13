import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { PostServiceService } from '../post-service.service';
import{Post} from '../posts.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[]=[];
  subscription:Subscription;
  isLoading:boolean = false;

  isAuthenticated:boolean = false;
  authSub:Subscription;
  userId:string;

  totalPosts:number;
  postsPerPage =10;
  currentPage =1;
  pageSizeOptions =[1,2,5,10];

  constructor(private postService: PostServiceService, private authSer:AuthService) {
    this.userId = this.authSer.getUserID();
  }

  ngOnInit(): void {
    this.isLoading =true;

    this.authSub = this.authSer.getAuthSub().subscribe(res=>
      {
        this.isAuthenticated = res;
      });

    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.subscription = this.postService.getUserPostsSub()
    .subscribe((data:any)=>{
      this.posts= data.posts;
      this.totalPosts = data.maxPosts;
      this.userId = this.authSer.getUserID();
      this.isLoading =false
    })
    // console.log('postlist 47',this.userId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authSub.unsubscribe();
    this.userId =null;
  }

  onDel(id:string){
    this.postService.deletePost(id);
  }

  onChangedPage(pageData:PageEvent){
    this.isLoading =true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }

}
