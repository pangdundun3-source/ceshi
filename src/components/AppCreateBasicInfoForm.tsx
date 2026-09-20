import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Image as ImageIcon,
  Trash2,
  Upload,
  UploadCloud,
} from 'lucide-react';

export interface AppCreateBasicInfoValues {
  appName: string;
  description: string;
  appIcon?: string;
  appIconName?: string;
}

interface AppCreateBasicInfoFormProps {
  values: AppCreateBasicInfoValues;
  errors: Record<string, string>;
  iconUploadError?: string | null;
  isDraggingIcon: boolean;
  iconInputRef: React.RefObject<HTMLInputElement | null>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIconFiles: (files: FileList | null) => void;
  onRemoveIcon: () => void;
  onDragState: (dragging: boolean) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AppCreateBasicInfoForm: React.FC<AppCreateBasicInfoFormProps> = ({
  values,
  errors,
  iconUploadError,
  isDraggingIcon,
  iconInputRef,
  onNameChange,
  onDescriptionChange,
  onIconFiles,
  onRemoveIcon,
  onDragState,
  onCancel,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="p-5 sm:p-7 flex flex-col gap-6 text-xs">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
          产品名称 <span className="text-rose-500 font-bold">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="例如：信息通报、正管用、谛听预警"
          value={values.appName}
          onChange={(e) => onNameChange(e.target.value)}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none text-slate-800 transition-all font-medium placeholder:text-slate-400 ${
            errors.appName
              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-200 focus:border-blue-500'
          }`}
          id="input_app_full_name"
        />
        {errors.appName ? (
          <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.appName}
          </p>
        ) : (
          <p className="text-[11px] text-slate-400">将作为产品列表与控制台详情页的主标题。</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-800">产品描述</label>
        <textarea
          rows={4}
          placeholder="简要说明此产品的业务定位、核心功能及解决的业务问题..."
          value={values.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-800 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 resize-y min-h-[96px]"
          id="input_app_description"
        />
        <p className="text-[11px] text-slate-400">选填。用于列表卡片和详情页介绍。</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>上传产品头像 / 图标</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <span className="text-[11px] text-slate-400">JPG / PNG / GIF / SVG，小于 5MB</span>
        </div>

        <input
          ref={iconInputRef}
          type="file"
          id="upload_app_icon_input"
          accept=".jpg,.jpeg,.gif,.png,.svg,image/jpeg,image/png,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onIconFiles(e.target.files);
            }
          }}
        />

        {!values.appIcon ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              onDragState(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              onDragState(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              onDragState(false);
              onIconFiles(e.dataTransfer.files);
            }}
            onClick={() => iconInputRef.current?.click()}
            className={`w-full p-5 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 select-none ${
              isDraggingIcon
                ? 'border-blue-500 bg-blue-50/70'
                : errors.appIcon
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 hover:border-blue-400 bg-slate-50/60'
            }`}
            id="app_icon_dropzone"
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                errors.appIcon ? 'bg-rose-100 text-rose-600' : 'bg-blue-100/70 text-blue-600'
              }`}>
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">点击上传，或把图片拖到这里</div>
                <p className="text-[11px] text-slate-500 mt-0.5">建议 128×128 正方形图标</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                iconInputRef.current?.click();
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              id="btn_browse_app_icon"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>选择本地文件</span>
            </button>
          </div>
        ) : (
          <div className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
                <img src={values.appIcon} alt="应用图标预览" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 truncate">{values.appIconName || '已上传图标'}</span>
                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] rounded inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    已就绪
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => iconInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                更换
              </button>
              <button
                type="button"
                onClick={onRemoveIcon}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {errors.appIcon && !values.appIcon && (
          <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.appIcon}
          </p>
        )}
        {iconUploadError && (
          <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {iconUploadError}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回应用列表</span>
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg cursor-pointer font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          id="btn_step1_next"
        >
          <span>下一步：配调用模块</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
