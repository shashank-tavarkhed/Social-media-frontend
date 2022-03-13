import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { PostServiceService } from '../post-service.service';
import {Post} from '../posts.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  post:Post;
  postID:string;
  mode:string = 'create';
  userID:string;

  constructor(private authSer:AuthService,private postService:PostServiceService,private route:ActivatedRoute, private router :Router) {
  }

  onSave(form:NgForm){
    if(form.invalid){
      return;
    }
    if(this.mode=='edit'){
      this.postService.updatePost(this.post.id,form.value.title,form.value.content);
      // alert("Post updated!")
      this.router.navigateByUrl('/home');
    }else if(this.mode == 'create'){
      this.postService.addPost(form.value.title,form.value.content);
      this.router.navigateByUrl('/home');
    }

    form.resetForm();
  }

  ngOnInit(){
    this.userID = this.authSer.getUserID();
    console.log('postCreate 40',this.userID);

    this.route.paramMap.subscribe((params: ParamMap) =>{
      if(params.has('postID')){
        this.mode = 'edit';
        this.postID = params.get('postID');
        this.postService.getPost(this.postID).subscribe(
          (postData) =>{
            this.post = { id: postData.data[0]._id, title: postData.data[0].title,content: postData.data[0].content, creator: this.userID}
          }
        )
      } else{
        this.mode = 'create';
        this.postID = null;
      }
    })
  }

}
