import { Request, Response } from 'express';


export const getUsers = async (req: Request, res: Response) => {
    // try {
    // const users = await User.find();
    res.status(200).json({ message: 'Get all users' });
    // } catch (error) {
    //     // res.status(500).json({ message: error.message });
    // }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Get user by id' });
        // const user = await User.findById(req.params.id);
        // res.status(200).json(user);
    } catch (error) {
        // res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req: Request, res: Response) => {
    // const user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    try {
        res.status(201).json({ message: 'Create user', user: req.body });
        // const newUser = await user.save();
        // res.status(201).json(newUser);
    } catch (error) {
        // res.status(400).json({ message: error.message });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        // const user = await User.findById(req.params.id);
        // if (user) {
        //     user.name = req.body.name;
        //     user.email = req.body.email;
        //     user.password = req.body.password;
        //     const updatedUser = await user.save();
        //     res.status(200).json(updatedUser);
        // } else {
        //     res.status(404).json({ message: 'User not found' });
        // }
        res.status(200).json({ message: 'Update user' });
    } catch (error) {
        // res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req: Request, res: Response) => {

    try {
        // const user = await User.findById(req.params.id);
        // if (user) {
        //     await user.remove();
        //     res.status(200).json({ message: 'User removed
        // } else {
        //     res.status(404).json({ message: 'User not found' });
        // }
        res.status(200).json({ message: 'Delete user' });
    } catch (error) {
        // res.status(500).json({ message: error.message });
    }
}
