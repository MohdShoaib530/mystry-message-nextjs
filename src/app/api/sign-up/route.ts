import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { apiResponse } from '@/types/ApiResponse';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedbyUserName = await UserModel.findOne({
      username,
      isVerified: true
    });
    if (existingUserVerifiedbyUserName) {
      return Response.json(
        {
          success: false,
          message: 'User already exists with this username'
        },
        {
          status: 400
        }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email'
          },
          {
            status: 400
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        existingUserByEmail.verifycodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifycodeExpiry: expiryDate,
        isAcceptingMessage: true,
        message: []
      });
      await newUser.save();
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: 'Error sending verification email'
          },
          {
            status: 500
          }
        );
      }
      return Response.json(
        {
          success: true,
          message: 'User registered successfully pleases verify your email'
        },
        {
          status: 201
        }
      );
    }
  } catch (error) {
    console.error('Error in regestering user', error);
    return Response.json(
      {
        success: false,
        message: 'Error in regestering user'
      },
      {
        status: 500
      }
    );
  }
}
