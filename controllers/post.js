import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPost = (req,res) => {
    const q = req.query.cat ? "SELECT p.id, title, 'desc', date, cat, country, username FROM posts p JOIN countries c ON p.cat = c.code JOIN users u ON u.id = p.uid where cat = ?" : "SELECT p.id, title, p.desc, date, cat, country, username FROM posts p JOIN countries c ON p.cat = c.code JOIN users u ON u.id = p.uid";
    db.query(q, [req.query.cat], (err, data) => {
        if (err) return res.send(err);
        return res.status(200).json(data);
    })
}

export const getSinglePost = (req,res) => {
    const q = "select p.id, `username`, `title`, `desc`, p.img, u.img as userImg, `cat`, `date` from users u join posts p on u.id = p.uid where p.id = ? ";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data[0]);
    });
};

export const addPost = (req, res) => {
    const q = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";
    const values = [ req.body.title, req.body.desc, req.body.img, req.body.cat, req.body.date, req.body.uid ];
    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been created.");
    });
};


export const deletePost = (req, res) => {
    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ?";
    db.query(q, [postId], (err, data) => {
        if (err) {
            return res.status(500).json("Failed to delete post!");
        }
        if (data.affectedRows === 0) {
            return res.status(403).json("You can delete only your post!");
        }
        return res.json("Post has been deleted!");
    });
};


export const updatePost = (req, res) => {
    const postId = req.params.id;
    
    const q =
        "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    db.query(q, [...values, postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been updated.");
    });
};
