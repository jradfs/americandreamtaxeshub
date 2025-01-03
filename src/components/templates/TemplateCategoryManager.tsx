'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TemplateCategory } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export function TemplateCategoryManager() {
    const supabase = createClientComponentClient();
    const [categories, setCategories] = useState<TemplateCategory[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState<TemplateCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateCategory = (category: { name: string, description: string }): boolean => {
        if (!category.name.trim()) {
            showErrorToast('Category name is required');
            return false;
        }
        if (category.name.length > 50) {
            showErrorToast('Category name must be 50 characters or less');
            return false;
        }
        return true;
    };

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('template_categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setCategories(data);
        } catch (error) {
            showErrorToast('Failed to fetch categories');
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    const createCategory = async () => {
        if (!validateCategory(newCategory)) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('template_categories')
                .insert(newCategory)
                .select();

            if (error) throw error;
            if (data) {
                setCategories([...categories, data[0]]);
                setNewCategory({ name: '', description: '' });
                showSuccessToast('Category created successfully');
            }
        } catch (error) {
            showErrorToast('Failed to create category');
            console.error('Error creating category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCategory = async () => {
        if (!editingCategory) return;

        if (!validateCategory(editingCategory)) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('template_categories')
                .update({ 
                    name: editingCategory.name, 
                    description: editingCategory.description 
                })
                .eq('id', editingCategory.id)
                .select();

            if (error) throw error;
            if (data) {
                setCategories(categories.map(cat => 
                    cat.id === editingCategory.id ? data[0] : cat
                ));
                setEditingCategory(null);
                showSuccessToast('Category updated successfully');
            }
        } catch (error) {
            showErrorToast('Failed to update category');
            console.error('Error updating category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('template_categories')
                .delete()
                .eq('id', categoryId);

            if (error) throw error;
            
            setCategories(categories.filter(cat => cat.id !== categoryId));
            showSuccessToast('Category deleted successfully');
        } catch (error) {
            showErrorToast('Failed to delete category');
            console.error('Error deleting category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories, supabase]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Template Categories</h2>
            
            <div className="flex space-x-2">
                <Input
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    disabled={isLoading}
                />
                <Input
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    disabled={isLoading}
                />
                <Button 
                    onClick={createCategory} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add Category'}
                </Button>
            </div>

            <div className="space-y-2">
                {categories.map(category => (
                    <div 
                        key={category.id} 
                        className="border p-3 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-gray-600">{category.description}</p>
                        </div>
                        <div className="space-x-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                        variant="outline"
                                        onClick={() => setEditingCategory(category)}
                                    >
                                        Edit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Category</DialogTitle>
                                    </DialogHeader>
                                    {editingCategory && (
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Category Name"
                                                value={editingCategory.name}
                                                onChange={(e) => setEditingCategory({
                                                    ...editingCategory, 
                                                    name: e.target.value
                                                })}
                                            />
                                            <Input
                                                placeholder="Description"
                                                value={editingCategory.description}
                                                onChange={(e) => setEditingCategory({
                                                    ...editingCategory, 
                                                    description: e.target.value
                                                })}
                                            />
                                            <Button 
                                                onClick={updateCategory}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Button 
                                variant="destructive"
                                onClick={() => deleteCategory(category.id)}
                                disabled={isLoading}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
