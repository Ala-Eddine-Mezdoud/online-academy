-- Fix Enrollment RLS Policy
-- Run this SQL in your Supabase SQL Editor to fix the enrollment visibility issue

-- Drop the old policy
DROP POLICY IF EXISTS "Enrollments: select student/teacher/admin" ON enrollments;

-- Create the corrected policy
-- This allows:
-- 1. Students to see their own enrollments
-- 2. Teachers to see enrollments in their courses
-- 3. Admins to see all enrollments
CREATE POLICY "Enrollments: select student/teacher/admin" ON enrollments FOR SELECT
USING (
    student_id = auth.uid() OR
    exists (SELECT 1 FROM courses c WHERE c.id = course_id AND c.teacher_id = auth.uid()) OR
    exists (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
